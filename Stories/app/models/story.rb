class Story < ActiveRecord::Base

  #-- Validations ---------------------------------------------------------
  validates :title, presence: true
  validates :url, presence: true
  validates :submitted_at, presence: true

  #-- Callbacks -----------------------------------------------------------
  before_validation :set_submitted_at, if: :new_record?

  #-- Instance Methods ----------------------------------------------------
  def set_submitted_at
    self.submitted_at = Time.now
  end

end
