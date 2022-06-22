import re

regex = re.compile(
    r"([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])")


def email_validation(email):
    return re.fullmatch(regex, email)


# https://stackoverflow.com/questions/19859282/check-if-a-string-contains-a-number
def has_numbers(inputString):
    return any(char.isdigit() for char in inputString)


def text_validation(text):
    if len(str(text)) < 1:
        return False
    if not has_numbers(text):
        return True


# https://www.adamsmith.haus/python/answers/how-to-check-if-a-string-contains-only-numbers-in-python
def plz_validation(plz):
    return str(plz).isdecimal()


def validate_participant(participant):
    if len(str(participant["adress"])) > 1 and text_validation(participant["concert"]) and email_validation(
            participant["email"]) and plz_validation(participant["plz"]) and text_validation(
            participant["prename"]) and text_validation(participant["surname"]):
        return True
    else:
        return False
