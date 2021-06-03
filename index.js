const patientList  = document.querySelector('#tbody');
const form = document.querySelector('#add-patient-form');

setInterval(setTime, 1000);

function setTime(){
  var time = document.getElementById("time");
  var newTime = new Date().toLocaleTimeString();
  time.innerHTML = newTime;
}

function setRecord(){
  var record = new Date().toLocaleString();
  return record;
}

function setCondition(temp, oxygen, heart){
  var cond = 'Healthy';
  if (temp < 100 && oxygen > 95 && heart == 70){
    cond = 'Healthy';
  }
  else if (temp > 100 && oxygen < 95 && heart == 70){
    cond = 'Mild';
  }
  else if (temp > 102 || oxygen < 90){
    cond = 'Severe';
  }
  return cond;
}

//create element and render patients
function renderPatients(doc){

  let tr = document.createElement('tr');
  let patientID = document.createElement('td');
  let name = document.createElement('td');
  let heart = document.createElement('td');
  let oxygen = document.createElement('td');
  let temp = document.createElement('td');
  let dor = document.createElement('td');
  let cond = document.createElement('td');
  let cross = document.createElement('button');

  tr.setAttribute('data-id', doc.id);
  patientID.textContent = doc.data().patientID;
  name.textContent = doc.data().name;
  heart.textContent = doc.data().heart;
  oxygen.textContent = doc.data().oxygen;
  temp.textContent = doc.data().temp;
  dor.textContent = doc.data().dor;
  cond.textContent = doc.data().cond;
  cross.textContent = 'Delete';

  tr.appendChild(patientID);
  tr.appendChild(name);
  tr.appendChild(heart);
  tr.appendChild(oxygen);
  tr.appendChild(temp);
  tr.appendChild(dor);
  tr.appendChild(cond);
  tr.appendChild(cross);  

  patientList.appendChild(tr);

  //deleting data
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');  
    db.collection('patients').doc(id).delete();
  })
}

//saving data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('patients').add({
    patientID: form.patientID.value,
    name: form.name.value,
    heart: form.heart.value,
    oxygen: form.oxygen.value,
    temp: form.temp.value,
    dor: setRecord(),
    cond: setCondition(form.temp.value, form.oxygen.value, form.heart.value)
  });
  form.patientID.value='';
  form.name.value='';
  form.heart.value='';
  form.oxygen.value='';
  form.temp.value='';
});

//real-time listener
db.collection('patients').orderBy('dor').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type == 'added'){
      renderPatients(change.doc)
    } else if (change.type == 'removed'){
      let tr = patientList.querySelector('[data-id =' + change.doc.id + ']');
      patientList.removeChild(tr);
    }
  })
})    