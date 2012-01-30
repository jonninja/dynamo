var should = require("should")
  , dynamo = require("../../")
  , db = dynamo.createClient()
  , tables = db.tables

describe("TableList", function() {
  describe("#get()", function() {
    it("should return a table", function() {
      var table = tables.get("TEST_NAME")

      should.exist(table)
      table.should.have.property("name", "TEST_NAME")
    })
  })

  describe("#fetch()", function() {
    it("should return a list of tables", function(done) {
      tables.fetch(function(err, tables) {
        should.not.exist(err)
        should.exist(tables)
        tables.should.have.property("length")
        tables.length.should.be.above(1)

        done()
      })
    })

    it("should support continuations", function(done) {
      var first = true

      tables.fetch(1, function(err, tables, next) {
        should.not.exist(err)
        should.exist(tables)
        tables.should.have.property("length", 1)

        if (first) {
          first = false
          should.exist(next)
          next()
        }

        else done()
      })
    })
  })

  describe("#forEach()", function() {
    it("should callback with a table and continuation", function(done) {
      tables.forEach(function(err, table, next) {
        should.not.exist(err)
        should.exist(table)
        should.exist(next)

        table.should.have.property("name")
        next.should.be.a("function")

        done()
      })
    })

    it("should callback with continuation until end", function(done) {
      tables.forEach(function(err, table, next) {
        (next || done)()
      })
    })
  })
})

