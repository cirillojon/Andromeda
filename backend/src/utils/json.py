from datetime import datetime, date

# Define a helper function for JSON serialization
def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if obj is None:
        return None
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))

def safe_json_serial(obj):
    try:
        return json_serial(obj)
    except TypeError:
        return None