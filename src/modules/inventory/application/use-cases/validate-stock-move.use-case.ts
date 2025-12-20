
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IStockMoveRepository } from '../../domain/repositories/stock-move.repository.interface';
import type { IStockQuantRepository } from '../../domain/repositories/stock-quant.repository.interface';
import { StockQuant } from '../../domain/entities/stock-quant.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ValidateStockMoveUseCase {
    constructor(
        @Inject('IStockMoveRepository')
        private readonly stockMoveRepo: IStockMoveRepository,
        @Inject('IStockQuantRepository')
        private readonly stockQuantRepo: IStockQuantRepository,
        private readonly dataSource: DataSource,
    ) { }

    async execute(companyId: string, moveId: string, userId: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Re-fetch move inside transaction or ensure it's up to date. 
            // Since repo methods abstract specific DB calls, we might need a way to pass queryRunner/manager to repos if we want to use them inside transaction correctly
            // OR use the repository from the manager.
            // But strict DDD separates repository from transaction manager often.
            // For TypeORM, the easiest is to use manager.getRepository() or QueryRunner.

            // To adhere to strict DDD with Repositories hiding TypeORM, we should pass an optional TransactionManager to repository methods.
            // But let's stick to the practical approach used in Refactoring: Use QueryRunner here directly OR assume repos handle it?
            // The previous code in Service used QueryRunner manually. I will replicate that logic but encapsulated here.

            // However, Injecting 'IStockMoveRepository' uses TypeOrmStockMoveRepository which uses `this.repository`.
            // Calling it won't use the transaction.

            // OPTION: We use `queryRunner.manager` to do operations.
            // To do this cleanly, we might duplicate some logic or use the BaseRepository methods if they accept EntityManager.
            // Our BaseTenantTypeOrmRepository DOES NOT accept EntityManager in methods.

            // So I will implement the logic using QueryRunner directly here, bypassing the Standard Repository for the transactional part,
            // OR I will extend Repository Interface to support transactional execution (e.g. `withTransaction(tx)`).

            // For now, I will follow the explicit TypeORM transaction style within the Use Case for simplicity and robustness.

            const move = await queryRunner.manager.findOne('StockMove', { where: { id: moveId, companyId } });
            if (!move) throw new NotFoundException(`Stock move ${moveId} not found`);
            if (move['state'] === 'done') throw new BadRequestException('Move already validated');

            // Update Quantities
            if (move['sourceLocationId']) {
                await this.updateQuant(companyId, move['productId'], move['sourceLocationId'], -Number(move['quantity']), queryRunner.manager);
            }
            if (move['destLocationId']) {
                await this.updateQuant(companyId, move['productId'], move['destLocationId'], Number(move['quantity']), queryRunner.manager);
            }

            move['state'] = 'done';
            move['updatedBy'] = userId;
            const updatedMove = await queryRunner.manager.save(move);

            await queryRunner.commitTransaction();
            return updatedMove;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    private async updateQuant(companyId: string, productId: string, locationId: string, amount: number, manager: any) {
        // Use Optimistic Locking or Select For Update to prevent race conditions
        let quant = await manager.findOne(StockQuant, {
            where: { productId, locationId },
            lock: { mode: 'pessimistic_write' }
        });

        if (!quant) {
            quant = manager.create(StockQuant, {
                companyId,
                productId,
                locationId,
                quantity: 0,
            });
        }
        quant.quantity = Number(quant.quantity) + amount;
        await manager.save(quant);
    }
}
