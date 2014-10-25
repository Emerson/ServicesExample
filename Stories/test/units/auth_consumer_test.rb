require 'test_helper'

class AuthConsumerTest < ActiveSupport::TestCase

  def setup
    @auth = AuthConsumer.new(url: 'http://localhost:3030', auth_token: 'xxxxxx')
  end

  test "is_authorized? returns false if there is no auth token" do
    @auth.auth_token = nil
    assert !@auth.is_authorized?
  end

  test "is_authorized? returns true if the auth server responds with {authenticated: true}" do
    VCR.use_cassette('valid_token') do
      assert @auth.is_authorized?
    end
  end

  test "is_authorized? returns false if the auth server responds with {authenticated: false}" do
    @auth.auth_token = 'invalid'
    VCR.use_cassette('invalid_token') do
      assert !@auth.is_authorized?
    end
  end

end