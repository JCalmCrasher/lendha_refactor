@component('mail::message')
#Dear {{ $data['name'] }},

This is a reminder that your payment of {{ $data['repayment_amount'] }} is/was due on {{$data['due_date']}}. Please endeavor to repay your loan to continue accessing our loan facilities anytime and anywhere.

Thanks,<br>
{{ config('app.name') }}.
@endcomponent
