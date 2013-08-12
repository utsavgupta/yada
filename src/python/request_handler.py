import lookup

def handler(view, frame, location, nav_action, decision, data=None):

    # extract the protocol from the request
    (protocol, request) = _parse_request(location)
    
    print {
        'search': lambda r : handle_search(r[1:], view)  # invoke search function for all search://... requests
    }.get(protocol, lambda r: "unable to find protocol")(request)

    return True  # inform Webkit that a navigation decision has been taken, which keeps Webkit from acting on the request made by the page 
    
def _parse_request(location):

    protocol, request = location.get_uri().split(':/', 1)

    return (protocol, request)

def handle_search(word, view):

    res = lookup.lookup_phrase(word)  # lookup the phrase
    view.execute_script("render_definitions(" + res + ");")  # invoke the render_definitions function defined in application.js
