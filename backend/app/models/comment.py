from db import db

class CommentModel(db.Model):
  __tablename__ = "comments"

  id = db.Column(db.Integer, primary_key=True)
  text = db.Column(db.Text, nullable=False)  
  # https://docs.sqlalchemy.org/en/20/orm/basic_relationships.html#one-to-many
  query_id = db.Column(db.Integer, db.ForeignKey("queries.id"), unique=False, nullable=False)
  query_info = db.relationship("QueryModel", back_populates="comments")
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False)
  user_info = db.relationship("UserModel", back_populates="comments")

  def json(self):
    return {
      "id": self.id,
      "text": self.text,
      "query_id": self.query_id,
      "user_id": self.user_id,
      "username": self.user_info.username      
    }
  
  @classmethod
  def find_all_by_user(cls, id):
    return cls.query.filter_by(user_id = id).all()
  
  def save_to_db(self):
    db.session.add(self)
    db.session.commit()

  def delete_from_db(self):
    db.session.delete(self)
    db.session.commit()