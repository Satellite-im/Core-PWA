use tauri::{command};

// Handler to show dock notifications. Borrowed from here: https://github.com/mantou132/nesbox/blob/dev/packages/tauriapp/src/handler.rs
// Windows commented out until we have a chance to set up code signing for it
#[command]
pub fn set_badge(count: i32) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    unsafe {
        use cocoa::{appkit::NSApp, base::nil, foundation::NSString};

        let label = if count == 0 {
            nil
        } else {
            NSString::alloc(nil).init_str(&format!("{}", count))
        };
        let dock_tile: cocoa::base::id = msg_send![NSApp(), dockTile];
        let _: cocoa::base::id = msg_send![dock_tile, setBadgeLabel: label];
    }

    
    // #[cfg(target_os = "windows")]
    // {
    //     use windows::{
    //         Data::Xml::Dom::XmlDocument,
    //         UI::Notifications::{BadgeNotification, BadgeUpdateManager},
    //     };

    //     let xml = XmlDocument::new().unwrap();
    //     xml.LoadXml(format!(r#"<badge value="{}"/>"#, count))
    //         .unwrap();

    //     let badge = BadgeNotification::CreateBadgeNotification(xml).unwrap();

    //     BadgeUpdateManager::CreateBadgeUpdaterForApplication()
    //         .map(|badge_updater| badge_updater.Update(badge).unwrap())
    //         .map_err(|err| err.message().to_string())?;
    // }
    Ok(())
}