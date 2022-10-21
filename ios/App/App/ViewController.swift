//
//  ViewController.swift
//  App
//
//  Created by Jason Woodland on 13/10/2022.
//

import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange), name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
        self.webView?.evaluateJavaScript("window.app=document.querySelector('#app')")
    }
    
    @objc func keyboardWillChange(notification: NSNotification) {
        guard let userInfo = notification.userInfo else { return }

        let duration = userInfo[UIResponder.keyboardAnimationDurationUserInfoKey] as! Double
        let targetFrame = (userInfo[UIResponder.keyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        let height = UIScreen.main.bounds.height - targetFrame.origin.y
        
        self.webView?.evaluateJavaScript("window.dispatchEvent(new CustomEvent('keyboardHeight', { detail: { height: \(height), duration: \(duration) } }));")

    }

}
