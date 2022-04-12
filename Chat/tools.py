import datetime
import pytz
from django.conf import settings
from django.http import HttpResponse
import re
import json
import random, string


Dict_Char_Persian_English = {
    'ا':'a1',
    'آ':'a2',
    'ب':'b1',
    'پ':'p1',
    'ت':'t1',
    'ث':'c1',
    'ج':'j1',
    'چ':'ch',
    'ح':'h1',
    'خ':'kh',
    'د':'d1',
    'ذ':'z1',
    'ر':'r1',
    'ز':'z2',
    'ژ':'zh',
    'س':'c2',
    'ش':'sh',
    'ص':'c3',
    'ض':'z3',
    'ط':'t2',
    'ظ':'z4',
    'ع':'a3',
    'غ':'g_',
    'ف':'f1',
    'ق':'g5',
    'ک':'k1',
    'گ':'k2',
    'ل':'l1',
    'م':'m1',
    'ن':'n1',
    'و':'v1',
    'ه':'h2',
    'ی':'e2',
    ' ':'11',
    '':'22',
}

def ConvertPersianCharToEnglish(Text):
    Res = ''
    for i in Text:
        try:
            Res += Dict_Char_Persian_English[i]
        except:
            Res += i
    return Res


def Set_Cookie(response, key, value, days_expire=7):
    if days_expire is None:
        max_age = 365 * 24 * 60 * 60  # one year
    else:
        max_age = days_expire * 24 * 60 * 60
    expires = datetime.datetime.strftime(
        datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age),
        "%a, %d-%b-%Y %H:%M:%S GMT",
    )
    response.set_cookie(
        key,
        value,
        max_age=max_age,
        expires=expires,
        domain=settings.SESSION_COOKIE_DOMAIN,
        secure=settings.SESSION_COOKIE_SECURE or None,
    )
    return response

def Set_Cookie_Functionality(Text,Type,Timer='7000',LevelOfNecessity='3',RedirectTo=None):
    if RedirectTo == None:
        Res = HttpResponse('<script>window.location=document.referrer;</script>')
    else:
        Res =  HttpResponse(f"<script>location.href='{RedirectTo}';</script>")
    Set_Cookie(Res,'Functionality_N',f"{Text}~{Type}~{Timer}~{LevelOfNecessity}",1)
    return Res



def GetTimeIran():
    TimeIranZone = pytz.timezone('Asia/Tehran')
    TimeIranObject = datetime.datetime.now(TimeIranZone)
    TimeIran = TimeIranObject.now()
    return TimeIran


def GetDifferenceTime(Time):
    TimeIranZone = pytz.timezone('Asia/Tehran')
    TimeServer = datetime.datetime.now(TimeIranZone)
    DifferenceTime = datetime.datetime(TimeServer.year, TimeServer.month, TimeServer.day, TimeServer.hour,
                                       TimeServer.minute) - datetime.datetime(Time.year, Time.month, Time.day, Time.hour,
                                                                            Time.minute)
    DifferenceTimeSecond = DifferenceTime.seconds
    Second = DifferenceTimeSecond % 60
    Minute = DifferenceTimeSecond // 60 % 60
    Hour = DifferenceTimeSecond // 3600
    Day = DifferenceTime.days
    Str = ''
    if Minute > 0:
        Str = f'{Minute} Minutes'
    else:
        Str = f'Now'

    if Hour > 0:
        Str = f'{Hour} Hour'

    if Day > 0:
        Str = f'{Day} Days'

    return Str


def GetDifferenceDate(Time):
    TimeIranZone = pytz.timezone('Asia/Tehran')
    TimeIranObject = datetime.datetime.now(TimeIranZone)
    TimeIran = TimeIranObject.now()
    DifferenceTime = datetime.datetime(TimeIran.year, TimeIran.month, TimeIran.day) - datetime.datetime(Time.year,
                                                                                                        Time.month,
                                                                                                        Time.day)
    Day = DifferenceTime.days
    Str = ''
    if Day > 0:
        Str = f'{Day} روز '
    else:
        Str = f'امروز'

    if Day > 6:
        Str = f'{Day} هفته '

    if Day > 30:
        Str = f'{Day}  ماه '

    return Str


def GetDifferenceTwoTime(Time_First, Time_Second):
    Time_First = datetime.datetime(Time_First.year, Time_First.month, Time_First.day, Time_First.hour,
                                   Time_First.minute)
    Time_Second = datetime.datetime(Time_Second.year, Time_Second.month, Time_Second.day, Time_Second.hour,
                                    Time_Second.minute)
    DefferenceTime = Time_First - Time_Second
    DaysDefference = DefferenceTime.days
    if DaysDefference < 1:
        HourDefference = DefferenceTime.seconds // 3600
        if HourDefference < 1:
            MinuteDefference = DefferenceTime.seconds // 60 % 60
            return f'{MinuteDefference} دقیقه '
        return f'{HourDefference} ساعت '
    return f'{DaysDefference} روز '


def ValidationText(Text, Bigger=None, Less=None, NoSpace=False, En=False):
    State = False

    if Text is not None and Text is not '' and str(Text).strip() is not '':
        State = True
        Text = str(Text)
        if Bigger != None and Less != None:
            State_Bigger = False
            State_Less = False
            if Bigger < len(Text):
                State_Bigger = True
            else:
                State_Bigger = False
            if Bigger < 0:
                State_Bigger = True
            if Less > len(Text):
                State_Less = True
            else:
                State_Less = False
            if State_Less == True and State_Bigger == True:
                State = True
            else:
                State = False
    else:
        if Bigger < 0:
            State = True
    if NoSpace:
        if ' ' in Text:
            State = False
    if En:
        if bool(re.match('[a-zA-Z0-9]+$', Text)) == False:
            State = False

    if Text:
        if '<script>' in Text.strip():
            State = False

    return State


def ValidationPassword(Password,Bigger,Less):
    return ValidationText(Password,Bigger,Less,True,True)


def ValidationNumber(Number, Bigger=None, Less=None):
    StateNumber = Number.isdigit()
    if Number is not None:
        if StateNumber:
            if Bigger is not None and Less is not None:
                if Number > Bigger and Number < Less:
                    return True
                else:
                    return False
            else:
                return True
        return False
    return False


def ValidationEmail(Email, Bigger, Less):
    State = False
    try:
        if Email != None and Email != '' and Email != ' ':
            if re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", Email):
                LenEmail = len(Email)
                if Bigger >= 0:
                    if (LenEmail > Bigger) and (LenEmail < Less):
                        State = True
                else:
                    State = True
            else:
                State = False
        else:
            State = False
    except:
        pass
    return State


def SerializerTool(Model, Objects, Attributes='__All__', Methods=[]):
    # Model = eval(Objects[0].__class__.__name__)
    ListJSON = []
    for Object in Objects:
        JSON = {}
        AllFields = Model._meta.fields if Attributes == '__All__' else [Field for Field in Model._meta.fields if
                                                                        Field.name in Attributes]
        for Field in AllFields:
            Value = getattr(Object, Field.name)
            if Field.get_internal_type() == 'DateTimeField' or Field.get_internal_type() == 'DateField':
                Value = str(Value)
            if Field.get_internal_type() == 'ForeignKey':
                Value = str(Value.id)
            JSON[Field.name] = Value
        for Method in Methods:
            try:
                JSON[Method] = str(getattr(Object, Method)())
            except TypeError:
                raise Exception('Value Passed is not Method or Problem In Method')
        ListJSON.append(JSON)
    return json.dumps(ListJSON)


def ListIsNone(List):
    try:
        List[0]
        return False
    except:
        return True


def RandomString(Len=18):
    return ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=Len))


def Get_IP(request):
    Forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if Forwarded:
        IP = Forwarded.split(',')[0]
    else:
        IP = request.META.get('REMOTE_ADDR')
    return IP


def Distinct(model,querySet,field):
    set_itreable = []
    dict_obj = {}
    for o in querySet:
        set_itreable.append(getattr(o,field))
        dict_obj[getattr(o,field)] = o
    return list(dict_obj.values())


def ListIsNone(List):
    try:
        List[0]
        return False
    except:
        return True
