Pod::Spec.new do |s|
  s.name = 'BinderPurchases'
  s.version = '1.1.0'
  s.summary = 'BinderCopy StoreKit 2 purchase bridge'
  s.description = s.summary
  s.license = { :type => 'Proprietary' }
  s.author = 'Clearpath Systems LLC'
  s.homepage = 'https://clearpathsystems.tools'
  s.platforms = { :osx => '14.0' }
  s.swift_version = '5.9'
  s.source = { :git => 'https://github.com/gmbrocha/binder_copy_desktop.git' }
  s.static_framework = true
  s.dependency 'React-Core'
  s.frameworks = 'StoreKit'
  s.source_files = '*.{swift,m}'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
end
