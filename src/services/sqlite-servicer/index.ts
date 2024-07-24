class SqliteManager {
    public query(query: string, params: any): Promise<any> {
        return Promise.resolve({});
    }
    static instance: SqliteManager;
    static getInstance(): SqliteManager {
        if (!SqliteManager.instance) {
            SqliteManager.instance = new SqliteManager();
        }
        return SqliteManager.instance;
    }
};

export default SqliteManager;
