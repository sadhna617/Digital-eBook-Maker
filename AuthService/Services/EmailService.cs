using System.Net;
using System.Net.Mail;

public static class EmailService
{
    public static void Send(string to, string subject, string body)
    {
        var client = new SmtpClient("smtp.gmail.com", 587)
        {
            Credentials = new NetworkCredential("info.group034@gmail.com", "nzjtrvydpirhqpem"),
            EnableSsl = true
        };

        var mail = new MailMessage("info.group034@gmail.com", to, subject, body);
        client.Send(mail);
    }
}
