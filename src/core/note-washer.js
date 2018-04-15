
"use strict";

const noteRule = require('./note-rule.js');

var NoteWasher = function(parent){
    
    this.wash = function(notes){
        var highestGrade = -1;
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var grade = noteRule.getGrade(note.manifest);
            highestGrade = Math.max(highestGrade, grade);
        }

        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var upgradedManifest = noteRule.upgradeManifest(note.manifest);
            var newGrade = noteRule.getGrade(upgradedManifest);
            if(newGrade < highestGrade){
                notes.splice(i, 1);
                i--;
            }else if(newGrade == highestGrade){
                note.manifest = upgradedManifest;
            }
        }

        return notes;
    };
    
}

module.exports = NoteWasher;

