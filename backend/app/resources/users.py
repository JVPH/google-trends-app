from flask.views import MethodView
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
# access token acts as a proxy for having logged in
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, create_refresh_token, get_jwt_identity
from datetime import timedelta


from ..models.user import UserModel
from ..schemas import UserSchema

from sqlalchemy.exc import IntegrityError

blp = Blueprint("users", __name__, description="Operations on users.")

# @blp.route("/api/register")
# class UserRegister(MethodView):
#   @blp.arguments(UserSchema)
#   def post(self, user_data):
#     user = UserModel(
#       username = user_data["username"],
#       password = pbkdf2_sha256.hash(user_data["password"])      
#     )
#     try:
#       user.save_to_db()

#       return {"message":"User created successfully."}, 201
#     except IntegrityError:
#       abort(
#         400,
#         message="Username already exists."
#     )
      
@blp.route("/api/login")
class UserLogin(MethodView):
  @blp.arguments(UserSchema)
  def post(self, user_data):
    user = UserModel.query.filter(
      UserModel.username == user_data["username"]
    ).first()

    if user:
      access_token = create_access_token(identity=user.id, fresh=True, expires_delta=timedelta(weeks=1))
      return {"access_token": access_token, "username":user.username}, 200        
    
    new_user = UserModel(username=user_data["username"])
    new_user.save_to_db()

    access_token = create_access_token(identity=new_user.id, fresh=True, expires_delta=timedelta(weeks=1))
    return {"access_token": access_token, "username":new_user.username }, 200     

# @blp.route("/api/refresh")
# class TokenRefresh(MethodView):
#   @jwt_required(refresh=True)
#   def post(self):
#     current_user = get_jwt_identity()
#     new_token = create_access_token(identity=current_user, fresh=False)
#     return {"access token": new_token}



@blp.route("/api/users/<int:user_id>")
class User(MethodView):
  @blp.response(200, UserSchema)
  def get(self, user_id):
    user = UserModel.query.get_or_404(user_id)
    return user.json() 
  
