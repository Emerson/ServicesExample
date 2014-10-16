require 'test_helper'

class StoryTest < ActiveSupport::TestCase

  def test_valid_fixtures
    Story.all.each { |story| assert story.valid? }
  end

  def test_fixture_validations
    story = Story.create
    assert_errors_on Story.create, :title, :url
  end

  def test_sets_submitted_at
    story = Story.create(title: 'Submitted At', url: 'http://test.com')
    assert story.submitted_at
  end

end