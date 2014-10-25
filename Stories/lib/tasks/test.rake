namespace :test do
  task :run => ['test:units', 'test:functionals', 'test:generators', 'test:integration', 'test:units']
  Rails::TestTask.new(units: "test:prepare") do |t|
    t.pattern = 'test/units/**/*_test.rb'
  end
end