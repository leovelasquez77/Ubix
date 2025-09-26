import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBz2s5jDGtbNNpEQSVeqbkD85m6dTRWB0",
  authDomain: "ubix-81203.firebaseapp.com",
  projectId: "ubix-81203",
  storageBucket: "ubix-81203.appspot.com",
  messagingSenderId: "247852658625",
  appId: "1:247852658625:web:5dd6d4a09ca717267b0940",
  measurementId: "G-2Z859ZVS29"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Cargar SDK de Firebase
    const script = document.createElement('script');
    script.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
    script.onload = () => {
      const dbScript = document.createElement('script');
      dbScript.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js";
      dbScript.onload = () => {
      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();

      // Cargar usuarios desde Firestore
      db.collection("usuarios").get().then(snapshot => {
        usuarios = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        renderUsuarios();
      });

      // Guardar usuario en Firestore
      document.getElementById('guardar-usuario').onclick = function() {
        const username = document.getElementById('modal-username').value.trim();
        const password = document.getElementById('modal-password').value.trim();
        const rol = document.getElementById('modal-rol').value;
        const ruta = document.getElementById('modal-ruta').value;

        if (!username || !password) {
        alert('Usuario y contraseña son obligatorios.');
        return;
        }

        if (editIndex === null) {
        // Nuevo usuario
        if (usuarios.some(u => u.username === username)) {
          alert('Ya existe un usuario con ese nombre.');
          return;
        }
        db.collection("usuarios").add({
          username,
          password,
          rol,
          ruta: rol === 'Conductor' ? ruta : ''
        }).then(() => {
          db.collection("usuarios").get().then(snapshot => {
          usuarios = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          renderUsuarios();
          });
          document.getElementById('user-modal').style.display = 'none';
        });
        } else {
        // Editar usuario
        const userId = usuarios[editIndex].id;
        db.collection("usuarios").doc(userId).update({
          rol,
          ruta: rol === 'Conductor' ? ruta : ''
        }).then(() => {
          db.collection("usuarios").get().then(snapshot => {
          usuarios = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          renderUsuarios();
          });
          document.getElementById('user-modal').style.display = 'none';
        });
        }
      };

      // Eliminar usuario de Firestore
      document.getElementById('user-list').addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
        editIndex = parseInt(e.target.getAttribute('data-idx'));
        showModal('edit', usuarios[editIndex]);
        }
        if (e.target.classList.contains('delete-btn')) {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        if (confirm('¿Seguro que deseas eliminar este usuario?')) {
          const userId = usuarios[idx].id;
          db.collection("usuarios").doc(userId).delete().then(() => {
          db.collection("usuarios").get().then(snapshot => {
            usuarios = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            renderUsuarios();
          });
          });
        }
        }
      });
      };
      document.body.appendChild(dbScript);
    };
    document.body.appendChild(script);
    