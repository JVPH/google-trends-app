from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..schemas import QuerySchema, GoogleTrendsSchema
from ..models.query import QueryModel
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from ..utils.google_trends import query_dna_names, query_google_trends

blp = Blueprint("queries", __name__, description="Operation on queries")


@blp.route("/api/queries/<int:query_id>")
class Query(MethodView):
  @blp.response(200, QuerySchema)
  def get(self, query_id):    
    query = QueryModel.query.get_or_404(query_id)
    return query.json()  
  

@blp.route("/api/queries")
class QueryList(MethodView):
  @blp.response(200, QuerySchema(many=True))
  def get(self):
    return QueryModel.query.all()
  
  @jwt_required()
  @blp.arguments(QuerySchema)
  @blp.response(201, QuerySchema)
  def post(self, query_data):   
    current_user = get_jwt_identity()    
    query = QueryModel(user_id=current_user, **query_data)     
    try:
      query.save_to_db()
    except IntegrityError:
      abort(
        400,
        message="A query with that name already exists."
      )
    except SQLAlchemyError:      
      abort(500, message="An error occurred while inserting the query.")

    return query
  
@blp.route("/api/queries/dna_names")
class DNANamesList(MethodView):
  def get(self):
    dna_names = query_dna_names()
    return dna_names

@blp.route("/api/queries/make_dataset_query")
class TrendsDatasetList(MethodView):
  @blp.arguments(GoogleTrendsSchema)
  def get(self, query_data):
    result = query_google_trends(**query_data)
    return result
