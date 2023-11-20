from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..schemas import CommentSchema, CommentUpdateSchema
from ..models.comment import CommentModel
from sqlalchemy.exc import SQLAlchemyError

blp = Blueprint("comments", __name__, description="Operation on comments")


@blp.route("/api/comments/<int:comment_id>")
class Comment(MethodView):
  @blp.response(200, CommentSchema)
  def get(self, comment_id):            
    comment = CommentModel.query.get_or_404(comment_id)
    return comment.json()    
 

@blp.route("/api/comments")
class CommentList(MethodView):
  # Converts response into a list
  @blp.response(200, CommentSchema(many=True))
  def get(self):
    return CommentModel.query.all()
  

  @jwt_required(fresh=True)
  @blp.arguments(CommentSchema) # Adds API information to Swagger UI Docs
  @blp.response(201, CommentSchema)
  def post(self, comment_data):       
    current_user = get_jwt_identity()
    # pass comment data as keyword arguments
    comment = CommentModel(user_id=current_user, **comment_data)

    try:      
      comment.save_to_db()
    except SQLAlchemyError:
      abort(500, message="An error occurred while inserting the comment.")

    return comment
  
