from flask.views import MethodView
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
# access token acts as a proxy for having logged in
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, create_refresh_token, get_jwt_identity

from db import db
from models import UserModel
from schemas import UserSchema

from sqlalchemy.exc import IntegrityError

blp = Blueprint("users", __name__, description="Operations on users.")

@blp.route("/api/register")
class UserRegister(MethodView):
  @blp.arguments(UserSchema)
  def post(self, user_data):
    user = UserModel(
      username = user_data["username"],
      password = pbkdf2_sha256.hash(user_data["password"])      
    )
    try:
      db.session.add(user)
      db.session.commit()

      return {"message":"User created successfully."}, 201
    except IntegrityError:
      abort(
        400,
        message="Username already exists."
    )
      
@blp.route("/api/login")
class UserLogin(MethodView):
  @blp.arguments(UserSchema)
  def post(self, user_data):
    user = UserModel.query.filter(
      UserModel.username == user_data["username"]
    ).first()

    if user and pbkdf2_sha256.verify(user_data["password"], user.password):
      access_token = create_access_token(identity=user.id, fresh=True)
      # non fresh so the user doesn't have to re-log in for non crucial things. 
      # Fresh for deleting, editing or submitting
      refresh_token = create_refresh_token(identity=user.id)
      return {"access_token": access_token, "refresh_token": refresh_token}, 200

    abort(401, message="Invalid credentials.")

@blp.route("/api/refresh")
class TokenRefresh(MethodView):
  @jwt_required(refresh=True)
  def post(self):
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user, fresh=False)
    return {"access token": new_token}



@blp.route("/api/users/<int:user_id>")
class User(MethodView):
  @blp.response(200, UserSchema)
  def get(self, user_id):
    user = UserModel.query.get_or_404(user_id)
    return user.json()
  
  def delete(self, user_id):
    user = UserModel.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return {"message":"User deleted."}, 200
