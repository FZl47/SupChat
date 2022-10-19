from django import forms
from SupChat.models import Admin

class FormInformationAdmin(forms.ModelForm):
    # Use this form only for check validation data

    class Meta:
        model = Admin
        exclude = ('user','group_name','status_online','date_time_created','sections','last_seen')

