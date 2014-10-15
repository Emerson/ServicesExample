class StorySerializer < ActiveModel::Serializer

  attributes :id, :title, :url, :submitted_at

end