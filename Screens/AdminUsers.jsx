import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
 const { Text , StyleSheet, View, FlatList,} = require("react-native");

function AdminUser({ navigation }) {
  const [userData, setUserData] = useState('');
  const [allUserData, setAllUserData] = useState('');

  async function getallData() {
    axios.get('http://192.168.1.13:5001/get-all-users')
      .then(res => {
        setAllUserData(res.data.data);
      });
  }

  function deleteUser(data) {
    axios.post('http://192.168.1.13:5001/delete-user', { id: data._id })
      .then(res => {
        if (res.data.status === 'ok') {
          getallData();
        }
      });
  }

  useEffect(() => {
    getallData();
  }, []);

  const UserCard = ({ data }) => (
    <View style={styles.card}>
      <View style={styles.cardDetails}>
      <Text style={styles.email}>Email: {data.email}</Text>
        <Text style={styles.name}>Name: {data.name}</Text>
        <Text style={styles.id}>ID: {data._id}</Text>
        <Text style={styles.userType}>{data.userType}</Text>
      </View>
      <View>
        <Button buttonColor="#16423C" textColor="white" onPress={() => deleteUser(data)}>
          Delete
        </Button>
      </View>
    </View>
  );

  return (
    <>
      {/* <Text>Admin User Management</Text> */}
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Admin</Text>
          <Text style={styles.userType}>Total Users: {allUserData.length}</Text>
        </View>
        <FlatList
          data={allUserData}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <UserCard data={item} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  cardDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  id:{
    fontSize: 14,
    color: '#777777',
  }
});
export default AdminUser;
