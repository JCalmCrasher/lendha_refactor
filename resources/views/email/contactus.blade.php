@component('mail::message')
# Contact us message from {{$data['name']}},

Message: {{$data['message']}}

Thanks, anticipating your quick response.<br>
{{$data['name']}} <br>
{{$data['email']}}
@endcomponent
