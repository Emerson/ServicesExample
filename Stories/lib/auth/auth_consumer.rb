class AuthConsumer

  attr_accessor :auth_token

  def initialize(options)
    options.reverse_merge!(url: 'http://localhost:3030')
    @auth_token = options[:auth_token] || nil
    @conn = Faraday.new(url: options[:url]) do |faraday|
      faraday.request  :url_encoded
      faraday.request  :json
      faraday.response :json
      faraday.adapter  Faraday.default_adapter
    end
  end

  def is_authorized?
    return false unless @auth_token.present?
    response = @conn.get "/api/v1/users/authenticate/" + @auth_token
    response.body['authenticated'].present? && response.body['authenticated'] === true
  end

end