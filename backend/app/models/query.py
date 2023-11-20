from db import db
from utils import query_google_trends

class QueryModel(db.Model):
  __tablename__ = "queries"

  id = db.Column(db.Integer, primary_key=True)  
  week_start = db.Column(db.Date(), nullable=False)
  week_end = db.Column(db.Date(), nullable=False)
  refresh_start = db.Column(db.Date(), nullable=False)
  refresh_end = db.Column(db.Date(), nullable=False)
  dma_name = db.Column(db.String(), nullable=False)
  name = db.Column(db.String(100), nullable=False, unique=True)  
  comments = db.relationship("CommentModel", back_populates="query_info", lazy="dynamic")
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False)
  user_info = db.relationship("UserModel", back_populates="queries")

  def json(self):
    return {
      "id": self.id,
      "week_start": self.week_start,
      "week_end": self.week_end,     
      "refresh_start": self.refresh_start,
      "refresh_end": self.refresh_end, 
      "dma_name": self.dma_name,
      "name": self.name,
      "comments": self.comments,
      "user_id": self.user_id,
      "username": self.user_info.username,
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

  def make_google_trend_query(self):    
    query_data = {
      "week_start": self.week_start,
      "week_end": self.week_end,     
      "refresh_start": self.refresh_start,
      "refresh_end": self.refresh_end, 
      "dma_name": self.dma_name,
    } 
    results = query_google_trends(**query_data)
    return results
