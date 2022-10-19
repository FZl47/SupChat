import os
from django.conf import settings

class RemovePastFileWhenChangedMixin:
    """
        Set Fields => REMOVE_FILES_FIELD = [file,image,audio,...]
        and when change remove that file
    """

    def save(self,*args,**kwargs):
        model = self.__class__
        if self.pk:
            try:
                obj_with_old_fields = model.objects.get(pk=self.pk)
                for field in self.FIELDS_REMOVE_FILES:
                    past_value_field =  getattr(obj_with_old_fields,field)
                    # Check past value is valid
                    if past_value_field:
                        # Compare Field with old and new value
                        if getattr(self, field) != past_value_field:
                            self.delete_file(past_value_field.name)

            except model.DoesNotExist:
                # new instance
                pass

        super(RemovePastFileWhenChangedMixin,self).save(*args,**kwargs)

    def delete_file(self,address):
        address = os.path.join(settings.MEDIA_ROOT,address)
        if os.path.exists(address):
            os.remove(address)
        else:
            # File does not exist
            pass