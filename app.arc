@app
begin-app

@http
get /

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
