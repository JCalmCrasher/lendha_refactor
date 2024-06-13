<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class MerchantInvitationNotification extends Notification
{
    use Queueable;

    private $name;

    private $url;

    /**
     * Create a new notification instance.
     */
    public function __construct($name, $url)
    {
        $this->name = $name;
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Welcome to Lendha")
            ->greeting("Dear " . $this->name . ",")
            ->line("We're thrilled to welcome you to Lendha! We're excited to partner with you and empower your team to streamline your loan application and customer management processes.")
            ->line("Lendha is a comprehensive loan management platform designed to simplify and centralize all aspects of your loan operations.")
            ->line("From the initial loan application to customer onboarding, approval, and repayment, Lendha provides you with the tools and functionalities you need to manage your loan portfolio efficiently.")
            ->line("Here are just a few of the benefits you can expect with Lendha;")
            ->line(new HtmlString('<ul>'))
            ->line(new HtmlString(implode('', [
                '<li>Simplified Application Process: Provide your customers with a user-friendly online application experience that reduces errors and streamlines data collection.</li>',
                '<li>Centralized Customer Management: Maintain a comprehensive customer database with all loan-related information readily accessible.</li>',
                '<li>Dashboard: Gain valuable insights into your customers loan application process.</li>',
            ])))
            ->line(new HtmlString('</ul>'))
            ->line("To ensure the security of your account, we require you to change your default password.")
            ->line("Here's how to get started:")
            ->line(new HtmlString('<ol>'))
            ->line(new HtmlString('<li>Click the button below to accept the invitation</li>'))
            ->action("Accept Invite", $this->url)
            ->line(new HtmlString(implode('', [
                '<li>Create a strong password that is unique to this account. Here are some tips for creating a strong password:</li>',
            ])))
            ->line(new HtmlString('</ol>'))
            ->line(new HtmlString('<ul style="list-style-position: inside;">'))
            ->line(new HtmlString(implode('', [
                '<li style="text-indent: 25px;">Use a combination of upper and lowercase letters, numbers, and symbols.</li>',
                '<li style="text-indent: 25px;">Avoid using personal information like your birthday or name.</li>',
                '<li style="text-indent: 25px;">Make it at least 12 characters long.</li>',
            ])))
            ->line(new HtmlString('</ul>'))
            ->line("If you have any trouble logging in or creating a new password, please don't hesitate to contact our support team at info@lendha.com or visit our Help Center at https://lendha.com/#contact-us (if applicable).")
            ->line("We look forward to a successful partnership and helping you achieve your lending goals!");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
