require 'xcodeproj'
project_path = 'macos/binder-copy-desktop.xcodeproj'
project = Xcodeproj::Project.open(project_path)
app = project.targets.find { |target| target.name == 'binder-copy-desktop-macOS' }
abort 'Native app target missing' unless app
target = project.new_target(:ui_test_bundle, 'BinderCopyUITests', :osx, '14.0')
target.add_dependency(app)
group = project.main_group.new_group('BinderCopyUITests', 'BinderCopyUITests')
target.source_build_phase.add_file_reference(group.new_file('NativeSmoke.swift'))
target.build_configurations.each do |configuration|
  configuration.build_settings.merge!({
    'GENERATE_INFOPLIST_FILE' => 'YES', 'SWIFT_VERSION' => '5.0',
    'PRODUCT_NAME' => 'BinderCopyUITests', 'PRODUCT_MODULE_NAME' => 'BinderCopyUITests',
    'PRODUCT_BUNDLE_IDENTIFIER' => 'com.clearpathsystems.bindercopy.uitests',
    'TEST_TARGET_NAME' => app.name, 'CODE_SIGN_IDENTITY' => '-',
    'CODE_SIGNING_ALLOWED' => 'YES', 'ENABLE_APP_SANDBOX' => 'NO'
  })
end
project.save
scheme_path = "#{project_path}/xcshareddata/xcschemes/binder-copy-desktop-macOS.xcscheme"
scheme = Xcodeproj::XCScheme.new(scheme_path)
scheme.add_test_target(target)
scheme.save!
