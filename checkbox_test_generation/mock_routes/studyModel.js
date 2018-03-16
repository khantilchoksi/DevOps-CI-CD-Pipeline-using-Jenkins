// This is a constructor that is used to setup inheritance without
// invoking the base's constructor. It does nothing, so it doesn't
// create properties on the prototype like our previous example did
function surrogateCtor() {}

function extend(base, sub) {
  // Copy the prototype from the base to setup inheritance
  surrogateCtor.prototype = base.prototype;
  // Tricky huh?
  sub.prototype = new surrogateCtor();
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
}

StudyBase = function(incoming)
{
	var self = this;

	self.name = incoming.name;
    self.description = incoming.description;
    self.studyKind = incoming.studyKind;

    self.researcherName = incoming.researcherName;
    self.contact = incoming.contact;

    self.awards = incoming.awards;

    self.awardOptions = ['Amazon Gift Card', 'Github Swag', 'BrowserStack', 'Windows Surface RT', 'iPad Mini', 'Other', 'None'];

	self.status = "open";
	self.goal = incoming.goal || 100;

	self.invitecode = incoming.invitecode;
};

SurveyModel = function( incoming, token )
{
	var self = this;
	StudyBase.call(this, incoming);

	self.markdown = incoming.markdown;
	self.token = token;

	self.adminLink = "/studies/admin/?token=" + token;

	self.setPublicLink = function(id)
	{
		self.publicLink = "/studies/?id=" + id;
	};


	self.getMessage = function()
	{
		return {
	        text: "Your survey has been created.\n" +
              "Survey admin url:\n" + 
              self.adminLink + "\n" +
              "Public survey url: \n" + 
              self.publicLink + "\n"
            ,
            from:    "Chris Parnin <support@checkbox.io>",
            to:      self.researcherName + "<"+ self.contact +">",
            subject: "checkbox.io: survey created"
        };
	};
}

extend(StudyBase, SurveyModel);
//SurveyModel.prototype = new StudyBase();
//SurveyModel.prototype.constructor = SurveyModel;
exports.SurveyModel = SurveyModel;

DataStudyModel = function( incoming, token )
{
	var self = this;
	StudyBase.call(this, incoming);

	self.markdown = incoming.markdown;
	self.token = token;

	self.adminLink = "/studies/admin/?token=" + token;

	self.setPublicLink = function(id)
	{
		self.publicLink = "/studies/?id=" + id;
	};


	self.getMessage = function()
	{
		return {
	        text: "Your data study has been created.\n" +
              "Study admin url:\n" + 
              self.adminLink + "\n" +
              "Public data study url: \n" + 
              self.publicLink + "\n"
            ,
            from:    "Chris Parnin <support@checkbox.io>",
            to:      self.researcherName + "<"+ self.contact +">",
            subject: "checkbox.io: data study created"
        };
	};
}

extend(StudyBase, DataStudyModel);
//DataStudyModel.prototype = new StudyBase();
//DataStudyModel.prototype.constructor = DataStudyModel;
exports.DataStudyModel = DataStudyModel;
