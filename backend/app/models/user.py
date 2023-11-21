from ..db import db

class UserModel(db.Model):
  __tablename__ = "users"

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), nullable=False, unique=True)
  # password = db.Column(db.String(), nullable=False)
  comments = db.relationship("CommentModel", back_populates="user_info", lazy="dynamic")
  queries = db.relationship("QueryModel", back_populates="user_info", lazy="dynamic")

  def json(self):    
    return {
      "id": self.id,
      "username": self.username,
      "queries": self.queries,
      "comments": self.comments,      
    }

  def save_to_db(self):
    db.session.add(self)
    db.session.commit()

  def delete_from_db(self):
    db.session.delete(self)
    db.session.commit()