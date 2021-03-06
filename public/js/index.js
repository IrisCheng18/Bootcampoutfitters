// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    console.log(example);
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/items",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/items",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/items/" + id,
      type: "DELETE"
    });
  },

// Added PUT request to the object for UPDATE functionality
  updateExamples: function(id) {
    return $.ajax({
      url: "api/items/" + id,
      type: "PUT"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/item/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an item text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
       // Refresh only the div and not the entire page so as to retain data from get
       $("#bucketDiv").load(document.URL + " #bucketDiv");
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
    $("#bucketDiv").load(document.URL + " #bucketDiv");
  });
};

// handleUpdateBtnClick is called when the check button is clicked
var handleUpdateBtnClick = function () {
  var idToUpdate = $(this)
  .parent()
  .attr("data-id");
API.updateExamples(idToUpdate).then(function() {
  refreshExamples();
  $("#bucketDiv").load(document.URL + " #bucketDiv");
});
}

// Add event listeners to the submit and delete buttons and complete
$submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);
$(document).on("click", ".delete", handleDeleteBtnClick);
$(document).on("click", ".complete", handleUpdateBtnClick);
