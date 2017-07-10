if request.env.web2py_runtime_gae:
    db = DAL('gae')
    session.connect(request, response, db = db)
else:
    #db = DAL('mysql://jsdba:kdfns02@localhost/jsdb')
    db = DAL('sqlite://jsdb')

db.define_table('js',
                Field('name', length=128),
                Field('version', length=16),
                Field('updated', 'datetime'),
                Field('js', 'blob'))
