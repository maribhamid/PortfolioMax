const fs = require('fs');

const iconBuffer = fs.readFileSync('public/apple-touch-icon.png');
const iconBase64 = iconBuffer.toString('base64');

const mobileconfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>ConsentText</key>
    <dict>
        <key>default</key>
        <string>This profile installs the Marib Portfolio standalone app directly onto your iOS device home screen.</string>
    </dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>FullScreen</key>
            <true/>
            <key>Icon</key>
            <data>
${iconBase64}
            </data>
            <key>IsRemovable</key>
            <true/>
            <key>Label</key>
            <string>Marib Portfolio</string>
            <key>PayloadDescription</key>
            <string>Configures Web Clip for Marib Portfolio</string>
            <key>PayloadDisplayName</key>
            <string>Marib Portfolio</string>
            <key>PayloadIdentifier</key>
            <string>com.maribhamid.portfoliomax.webclip</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>4A2B8C1D-3E5F-4A9B-8C7D-6E5F4A3B2C1D</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>https://portfolio-max-three.vercel.app</string>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>Installs Marib Portfolio standalone app directly onto your iOS home screen.</string>
    <key>PayloadDisplayName</key>
    <string>Marib Portfolio App</string>
    <key>PayloadIdentifier</key>
    <string>com.maribhamid.portfoliomax.profile</string>
    <key>PayloadOrganization</key>
    <string>Marib Hamid</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>1D2C3B4A-5E6F-7A8B-9C0D-1E2F3A4B5C6D</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;

fs.writeFileSync('public/Marib-Portfolio.mobileconfig', mobileconfig);
fs.mkdirSync('ios/build', { recursive: true });
fs.writeFileSync('ios/Marib-Portfolio.mobileconfig', mobileconfig);
console.log('Successfully generated Marib-Portfolio.mobileconfig in public/ and ios/!');
