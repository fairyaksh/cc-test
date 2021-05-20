"""
This is the users module and supports all the REST actions for the
USERS collection
"""

# 3rd party modules
from flask import make_response, abort

# Data to serve with our API (fake DB)
USERS = {
  "Satheesh": {
    "username": "Satheesh",
    "id": 721485698576,
    "xid": "7469d8e9-2c99-4b43-9e32-40eb6a48ac26",
    "strategy": "reduce fossil fuel"
  },
  "Smith": {
    "username": "Smith",
    "id": 189664768549,
    "xid": "0f69445e-c7aa-4b0b-8e5a-bd5a35a51182",
    "strategy": "electric cars"
  },
  "Easter": {
    "username": "Easter",
    "id": 943255771125,
    "xid": "7e0f80af-74be-45a1-b5b8-22d718794fae",
    "strategy": "more trees"
  }
}

# A handler for our readAll (GET) people
def read_all():
  """
  This function responds to a request for /api/users with the complete lists of people
  :return:        json string of list of users
  """

  # Create the list of people from our data
  return [USERS[key] for key in sorted(USERS.keys())]

def create(user_name):
  """
  This function creates a new user in the current database collection
  
  :param user:      user to create and add to database
  :return:          201 on success, 406 if person already exists
  """
  username = user_name.get("username", None)
  # strategy = user_strategy.get("strategy", None)

  # Does this user exist already?
  if username not in USERS:
    USERS[username] = {
      # id randomly generated ? e.g from a function
      "username": username,
      "id": 4389753485,
      "xid": "892804-2352-r2-232412-fsd34",
      "strategy": "down with capitalism"
    }
    return make_response(
      "{username} successfully created".format(username = username), 201
    )
  
  # Otherwise, no, throw an error
  else:
    abort(
      406,
      "Person with username {username} already exists".format(username = username)
    )

def read_one(username):
  """
  This function responds to a request for /api/users/{username}
  with one matching person from people  

  :param username:     username of user to find
  :return:             user matching given username
  """

  # Does this user exist in USERS?
  if username in USERS:
    user = USERS.get(username)
  
  # Otherwise, nope, doesn't exist/not found
  else:
    abort(
      404, "User with the username {username} does not exist".format(username = username)
    )
  
  return user