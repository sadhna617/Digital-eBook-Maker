using AuthService.Models;
using AuthService.Services;
using MongoDB.Driver;

namespace AuthService.Repositories
{
    public class UserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(MongoDbService mongo)
        {
            _users = mongo.Users;
        }

        public void Add(User user)
        {
            _users.InsertOne(user);
        }
        
        public User? GetByEmail(string email)
        {
            return _users.Find(u => u.Email == email).FirstOrDefault();
        }

        public User? GetByUsername(string username)
        {
            return _users.Find(u => u.Username == username).FirstOrDefault();
        }

        public User? GetById(string id) =>
            _users.Find(u => u.Id == id).FirstOrDefault();

        // find user by reset token
        public User? GetByResetToken(string token)
        {
            return _users.Find(u => u.ResetToken == token).FirstOrDefault();
        }

        // update user (for saving token or updating password)
        public void Update(User user)
        {
            _users.ReplaceOne(u => u.Id == user.Id, user);
        }

        // delete user by id
        public void Delete(string id)
        {
            _users.DeleteOne(u => u.Id == id);
        }

    }
}
