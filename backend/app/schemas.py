from marshmallow import Schema, fields


class PlainCommentSchema(Schema):
  id = fields.Int(dump_only=True)
  text = fields.Str(required=True)
  query_id = fields.Int(required=True)  

class PlainQuerySchema(Schema):
  id = fields.Int(dump_only=True)  
  name = fields.Str(required=True)
  week_start = fields.Date(required=True)
  week_end = fields.Date(required=True)
  refresh_start = fields.Date(required=True)
  refresh_end = fields.Date(required=True)
  dma_name = fields.Str(required=True)  


class PlainUserSchema(Schema):
  id = fields.Int(dump_only=True)
  username = fields.Str(required=True)
  # Never return password
  # password = fields.Str(required=True, load_only=True)
  

class CommentUpdateSchema(Schema):
  text = fields.Str()


class CommentSchema(PlainCommentSchema):  
  username = fields.Str(dump_only=True)


class QuerySchema(PlainQuerySchema):  
  comments = fields.List(fields.Nested(PlainCommentSchema()), dump_only=True)  
  username = fields.Str(dump_only=True)


class UserSchema(PlainUserSchema):
  comments = fields.List(fields.Nested(PlainCommentSchema()), dump_only=True)
  queries = fields.List(fields.Nested(PlainQuerySchema()), dump_only=True)

class GoogleTrendsSchema(Schema):
  week_start = fields.Date(required=True)
  week_end = fields.Date(required=True)
  refresh_start = fields.Date(required=True)
  refresh_end = fields.Date(required=True)
  dma_name = fields.Str(required=True)  