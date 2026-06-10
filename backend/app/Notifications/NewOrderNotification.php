<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\Message;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class NewOrderNotification extends Notification
{
    use Queueable;

    protected $order;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'message' => 'You have a new order from ' . $this->order->restaurant->name,
            'status' => $this->order->status,
        ];
    }
}