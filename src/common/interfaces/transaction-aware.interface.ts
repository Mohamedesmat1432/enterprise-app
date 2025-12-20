import { EntityManager } from 'typeorm';

export interface TransactionAware<T> {
    /**
     * returns a new instance of the repository/service scoped to the provided transaction credentials.
     */
    withTransaction(manager: EntityManager): T;
}
