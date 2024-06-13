@component('mail::message')
Dear {{ $name }},

We are sorry to inform you that your loan application has been denied. This is due to the following reasons:
    
    {{$reason}}

Please feel free to contact us for further clarification.

Best regards,<br>
{{ config('app.name') }}.
@endcomponent
