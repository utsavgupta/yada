#/usr/bin/env python

import request_handler
from gi.repository import Gtk
from gi.repository import WebKit
import os

def main():
    window = Gtk.Window()
    view = WebKit.WebView()
    scrolled_window = Gtk.ScrolledWindow()
    
    view.open(os.path.abspath(os.path.join(os.path.dirname(__file__), "../UI/App.html"))) # load the main UI of the application
    scrolled_window.set_size_request(1000, 900)
    
    window.set_title('YADA')
    
    scrolled_window.add(view)
    window.add(scrolled_window)
    
    window.show_all()
    
    window.connect('delete-event', lambda window, event: Gtk.main_quit())

    view.connect('navigation-policy-decision-requested', request_handler.handler) # tap all location requests and invoke the handler
    
    Gtk.main()

if __name__ == '__main__':
    main()
