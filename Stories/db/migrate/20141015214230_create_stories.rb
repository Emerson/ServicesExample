class CreateStories < ActiveRecord::Migration
  def change
    create_table :stories do |t|
      t.string :title
      t.string :url
      t.datetime :submitted_at

      t.timestamps
    end
  end
end
