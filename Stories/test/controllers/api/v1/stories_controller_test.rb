require 'test_helper'

class Api::V1::StoriesControllerTest < ActionController::TestCase

  def test_index
    get :index
    story = json_response[:stories].first
    assert_response :success
    assert story[:id].present?
    assert story[:title].present?
    assert story[:url].present?
    assert story[:submitted_at].present?
  end

  def test_show
    story = stories(:default)
    get :show, id: story.id
    assert_response :success
    assert_equal story.id, json_response[:story][:id]
    assert_equal story.title, json_response[:story][:title]
    assert_equal story.url, json_response[:story][:url]
    assert_equal story.submitted_at, json_response[:story][:submitted_at]
  end

  def test_create
    assert_difference "Story.count" do
      post :create, story: {
        title: 'New Story',
        url:   'http://ted.com'
      }
    end
    assert_response :success
    assert_equal 'New Story', json_response[:story][:title]
    assert_equal 'http://ted.com', json_response[:story][:url]
    assert json_response[:story][:id].present?
  end

end