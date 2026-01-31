using System.Text.RegularExpressions;

namespace AuthService.Utils;
public static class PasswordValidator
{
    public static bool IsValid(string password)
    {
        var regex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$");
        return regex.IsMatch(password);
    }
}
