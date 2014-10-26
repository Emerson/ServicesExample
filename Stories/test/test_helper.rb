ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'vcr'

VCR.configure do |c|
  c.cassette_library_dir = 'test/vcr_cassettes'
  c.hook_into :webmock # or :fakeweb
end

class ActiveSupport::TestCase
  fixtures :all

  def json_response
    JSON.parse(response.body, symbolize_names: true)
  end

  def login_user
    # xxxxxx has been mocked as an authenticated token using VCR
    request.headers['Authorization'] = "xxxxxx"
  end

  # Example usage:
  #   assert_errors_on @record, :field_1, :field_2
  def assert_errors_on(record, *fields)
    unmatched = record.errors.keys - fields.flatten
    assert unmatched.blank?, "#{record.class} has errors on '#{unmatched.join(', ')}'"
    unmatched = fields.flatten - record.errors.keys
    assert unmatched.blank?, "#{record.class} doesn't have errors on '#{unmatched.join(', ')}'"
  end

end