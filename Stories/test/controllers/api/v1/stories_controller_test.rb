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
    login_user
    VCR.use_cassette('valid_token') do
      assert_difference "Story.count" do
        post :create, story: {
          title: 'New Story',
          url:   'http://ted.com'
        }
      end
    end
    assert_response :success
    assert_equal 'New Story', json_response[:story][:title]
    assert_equal 'http://ted.com', json_response[:story][:url]
    assert json_response[:story][:id].present?
  end

  def test_update
    login_user
    story = stories(:default)
    VCR.use_cassette('valid_token') do
      put :update, id: story.id, story: {
        title: 'Updated Title',
        url:   'http://ted.com'
      }
    end
    assert_response :success
    assert_equal 'Updated Title', json_response[:story][:title]
    assert_equal 'http://ted.com', json_response[:story][:url]
  end

  def test_destroy
    login_user
    story = stories(:default)
    VCR.use_cassette('valid_token') do
      assert_difference "Story.count", -1 do
        delete :destroy, id: story.id
      end
    end
    assert_response :success
    assert json_response[:story][:id].present?
    assert json_response[:story][:title].present?
    assert json_response[:story][:url].present?
  end

  #-- Invalid Requests ----------------------------------------------------

  def test_story_not_found
    get :show, id: 999
    assert_response :not_found
  end

  def test_create_invalid
    login_user
    VCR.use_cassette('valid_token') do
      assert_no_difference "Story.count" do
        post :create, story: {}
      end
    end
    assert_response :unprocessable_entity
    assert json_response[:message].present?
    assert json_response[:errors][:title].present?
    assert json_response[:errors][:url].present?
  end

  def test_update_invalid
    login_user
    story = stories(:default)
    VCR.use_cassette('valid_token') do
      put :update, id: story.id, story: {
        url:   '',
        title: ''
      }
    end
    assert json_response[:message].present?
    assert json_response[:errors][:title].present?
    assert json_response[:errors][:url].present?
  end

end