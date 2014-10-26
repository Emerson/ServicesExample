class Api::BaseController < ApplicationController

  def auth_token
    request.headers['Authorization']
  end

  def require_login
    host = ENV['UPSURGE_AUTH_URL'] || 'http://localhost:3030'
    auth_consumer = AuthConsumer.new(auth_token: auth_token, url: host)
    if !auth_consumer.is_authorized?
      return render json: {message: 'You are not authorized to do that'}, status: 401
    end
  end

end