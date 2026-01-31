using MongoDB.Driver;
using AuthService.Models;

namespace AuthService.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(IConfiguration config)
        {
            var connectionString = config["MongoDb:ConnectionString"]!;
            var databaseName = config["MongoDb:DatabaseName"]!;

            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<User> Users =>
            _database.GetCollection<User>("users");
    }
}
